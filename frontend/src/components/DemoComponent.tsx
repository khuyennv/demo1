import React, { useEffect } from 'react';

import { AxiosResponse } from 'axios';

import {
	Box,
	Button,
	Grid,
} from '@material-ui/core';

import request from '../utils/request';
import { useStateWithPromise } from './SetStateWithPromise';

type EmailType = {
	id: number;
	mailTo: string;
	subject: string;
	completed: string;
	status: number;
	content: string;
};

type EmailsType = {
	pending: EmailType[];
	accepted: EmailType[];
};

const DemoComponent = () => {
	const [emails, setEmails] = useStateWithPromise<EmailsType>({
		pending: [],
		accepted: [],
	});
	const [pendingSelected, setPendingSelected] = useStateWithPromise<EmailType | null>(null);
	const [acceptSelected, setAcceptSelected] = useStateWithPromise<EmailType | null>(null);
	const [textAreaValue, setTextAreaValue] = useStateWithPromise<string>("");

	// init
	const init = async () => {
		await setAcceptSelected(null)
		await setPendingSelected(null)
		await setEmails({
			pending: [],
			accepted: [],
		});

		return;
	};

	/**
	 * Call api get email
	 */
	const getAllEmails = (): Promise<AxiosResponse<EmailsType>> =>
		request.get(`/emails`);

	/**
	 * Call api get email
	 */
	const updateEmails = (data: EmailsType): Promise<AxiosResponse<EmailsType>> =>
		request.post(`/emails`, data);

	/**
	 * Move left to right
	 */
	const moveRight = async () => {
		if (!pendingSelected) {
			alert("Please choose one item.");
			return;
		}

		const emailName = pendingSelected!.mailTo

		const pending = emails.pending.filter(
			(email) => email.mailTo !== emailName
		);

		const accepted = emails.accepted;
		accepted.push(pendingSelected!)

		await setEmails({
			pending: [...pending],
			accepted: [...accepted],
		});

		await setPendingSelected(null)

		return;
	};

	/**
	 * Move left to left
	 */
	const moveLeft = async () => {
		if (!acceptSelected) {
			alert("Please choose one item.");
			return;
		}
		const emailName = acceptSelected!.mailTo

		const pending = emails.pending;
		const accepted = emails.accepted.filter(
			(email) => email.mailTo !== emailName
		)

		pending.push(acceptSelected!);

		await setEmails({
			pending: [...pending],
			accepted: [...accepted],
		});

		await setAcceptSelected(null)

		return;
	};

	/**
	 * Update data
	 */
	const updateData = () => {
		updateEmails(emails)
			.then((result) => {
				parseResult(result)
			})
			.catch((e) => {
				alert("Update failed!");
				console.log(e);
			});
	};

	/**
	 * Parse data from call api 
	 */
	const parseResult = (result: AxiosResponse<EmailsType, any>) => {
		result.data.pending = result.data.pending.map((email) => {
			email.status = 0;

			return email;
		});
		result.data.accepted = result.data.accepted.map((email) => {
			email.status = 1;

			return email;
		});

		setEmails(result.data);

		return;
	}

	const onSubmit = () => {
		let result = "no, email to, subject, content \n"
		let index = 1
		emails.accepted.forEach(email => {
			result += `${index}, ${email.mailTo}, ${email.subject}, ${email.subject} \n`;
			index++
		})

		setTextAreaValue(result)
	}

	/**
	 * useEffect
	 */
	useEffect(() => {
		delay(200)
		console.log("log")
		getAllEmails().then((result) => {
			result.data.pending = result.data.pending.map((email) => {
				email.status = 0;

				return email;
			});
			result.data.accepted = result.data.accepted.map((email) => {
				email.status = 1;

				return email;
			});

			setEmails(result.data);
		}).catch((e) => {
			console.log(e);
		});
	}, []);


	/**
	 * Handler change action
	 */
	const onChangeHandler = (
		event: React.ChangeEvent<HTMLSelectElement>,
		type: string
	) => {
		const selectedOptions = event.currentTarget.selectedOptions;

		let mailName: string;
		for (let i = 0; i < selectedOptions.length; i++) {
			mailName = selectedOptions[i].value
		}

		let emailSelected: EmailType | undefined

		if (type === "pending") {
			emailSelected = emails.pending.find((email) => email.mailTo === mailName);
			emailSelected && setPendingSelected(emailSelected!);
		} else {
			emailSelected = emails.accepted.find((email) => email.mailTo === mailName);
			emailSelected && setAcceptSelected(emailSelected!);
		}
	};

	/**
	 * Delay x ms
	 */
	const delay = (ms: number) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	return (
		<><Grid container style={{ border: 1, padding: 40 }}>
			<Grid item xs={5}>
				<select
					size={5}
					onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
						onChangeHandler(event, "pending");
					}}
					onClick={(event: React.MouseEvent<HTMLSelectElement>) => {
						if (event.detail === 2) {
							moveRight().then(() => {
								updateData();
							});
						}
					}}
					id="pendingEmails"
					className="select"
				>
					{emails.pending &&
						emails.pending.map((email) => {
							return <option value={email.mailTo} key={email.mailTo}>{email.subject}</option>;
						})}
				</select>
			</Grid>
			<Grid item xs={2}>
				<Box textAlign="center">
					<Button
						variant="outlined"
						style={{ margin: "auto", display: "block" }}
						onClick={() => {
							moveRight().then(() => {
								updateData();
							});
						}}
					>
						{">"}
					</Button>
					<br />
					<Button
						variant="outlined"
						style={{ margin: "auto", display: "block" }}
						onClick={() => {
							moveLeft().then(() => {
								updateData();
							});
						}}
					>
						{"<"}
					</Button>
					<br />
					<Button
						variant="outlined"
						style={{ margin: "auto", display: "block" }}
						onClick={onSubmit}
					>
						{"Submit"}
					</Button>
				</Box>
			</Grid>
			<Grid item xs={5}>
				<select
					size={5}
					onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
						onChangeHandler(event, "accept");
					}}
					onClick={(event: React.MouseEvent<HTMLSelectElement>) => {
						if (event.detail === 2) {
							delay(500);
							// moveLeft();
							moveLeft().then(() => {
								updateData();
							});
						}
					}}
					className="select"
					id="acceptedEmails"
				>
					{emails.accepted &&
						emails.accepted.map((email) => {
							return <option value={email.mailTo} key={email.mailTo}>{email.subject}</option>;
						})}
				</select>
			</Grid>
		</Grid>
			<Grid container style={{ border: 1, padding: 40 }}>
				<Grid item xs={12}>
					<textarea
						value={textAreaValue}
						style={{ width: "100%", height: 300 }}
						readOnly={true}
					/>
				</Grid>
			</Grid></>
	);
};

export default DemoComponent;
