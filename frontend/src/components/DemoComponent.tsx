import React, {
	useEffect,
	useState,
} from 'react';

import { AxiosResponse } from 'axios';

import {
	Box,
	Button,
	Grid,
} from '@material-ui/core';

import request from '../utils/request';

type EmailType = {
  id: number;
  mailTo: string;
  subject: string;
  completed: string;
  status: number;
};

type EmailsType = {
  pending: EmailType[];
  accepted: EmailType[];
};

const DemoComponent = () => {
  const [emails, setEmails] = useState<EmailsType>({
    pending: [],
    accepted: [],
  });
  const [pendingSelected, setPendingSelected] = useState<EmailType[]>();
  const [acceptSelected, setAcceptSelected] = useState<EmailType[]>();

  // init
  const init = () => {
    setPendingSelected([]);
    setAcceptSelected([]);
    setEmails({
      pending: [],
      accepted: [],
    });
  };

  // Add mail to list mail
  const add = (addEmails: { pending: EmailType[]; accepted: EmailType[] }) => {
    setEmails({
      pending: [...emails.pending, ...addEmails.pending],
      accepted: [...emails.accepted, ...addEmails.accepted],
    });
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
  const moveRight = () => {
    if (pendingSelected && pendingSelected!.length === 0) {
      alert("Please choose one item.");
    }

    // Remove left
    const emailTos = pendingSelected
      ? pendingSelected?.map((e) => e.mailTo)
      : [];

    const pending = emails.pending.filter(
      (email) => !emailTos.includes(email.mailTo)
    );

    const accepted = emails.accepted;
    accepted.push(...pendingSelected!);

    // add right
    const data = {
      pending: [...pending],
      accepted: [...accepted],
    };

    setEmails(data);

    setPendingSelected([]);

    console.log("moveRight", JSON.stringify(pendingSelected), data);
  };

  /**
   * Move left to left
   */
  const moveLeft = () => {
    if (acceptSelected && acceptSelected!.length === 0) {
      alert("Please choose one item.");
    }

    // Remove left
    const emailTos = acceptSelected ? acceptSelected?.map((e) => e.mailTo) : [];

    const pending = emails.pending;

    const accepted = emails.accepted.filter(
      (email) => !emailTos.includes(email.mailTo)
    );
    pending.push(...acceptSelected!);

    // add right
    const data = {
      pending: [...pending],
      accepted: [...accepted],
    };

    setEmails(data);

    setAcceptSelected([]);

    console.log("moveRight", JSON.stringify(acceptSelected), data);
  };

  /**
   * Update data
   */
  const updateData = () => {
    updateEmails(emails)
      .then((result) => {
        alert("Update successful");
      })
      .catch((e) => {
        alert("Update failed!");
        console.log(e);
      });
  };

  // Effect
  useEffect(() => {
    console.log(
      "useEffect has been called! =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      emails
    );
  }, [emails.pending, emails.accepted]);

  useEffect(() => {
    init();

    getAllEmails()
      .then((result) => {
        result.data.pending = result.data.pending.map((email) => {
          email.status = 0;
          return email;
        });
        result.data.accepted = result.data.accepted.map((email) => {
          email.status = 1;
          return email;
        });

        add(result.data);
      })
      .catch((e) => {
        console.log(e);
      });

    console.log("useEffect has been called first!");
  }, []);

  /**
   * Handler change action
   */
  const onChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string
  ) => {
    console.log("onchange ->>>>>>>>>>>>>>>>>>>>>>>");

    const selectedOptions = event.currentTarget.selectedOptions;

    const allMailTo: string[] = [];
    for (let i = 0; i < selectedOptions.length; i++) {
      allMailTo.push(selectedOptions[i].value);
    }

    if (type === "pending") {
      const newEmails = emails.pending.filter((email) =>
        allMailTo.includes(email.mailTo)
      );
      console.log(newEmails, allMailTo);
      setPendingSelected(newEmails);

      return;
    }

    const newEmails = emails.accepted.filter((email) =>
      allMailTo.includes(email.mailTo)
    );

    setAcceptSelected(newEmails);
  };

  /**
   * Delay x ms
   */
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <Grid container style={{ border: 1, padding: 40 }} justifyContent="center">
      <Grid item xs={5}>
        <select
          multiple
          size={5}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            onChangeHandler(event, "pending");
          }}
          onClick={(event: React.MouseEvent<HTMLSelectElement>) => {
            if (event.detail === 2) {
              delay(500);
              moveRight();
            }
          }}
          id="pendingEmails"
          className="select"
        >
          {emails.pending &&
            emails.pending.map((email) => {
              return <option value={email.mailTo}>{email.subject}</option>;
            })}
        </select>

        {/* Display the selected values */}
        {pendingSelected &&
          pendingSelected.map((email) => (
            <span className="color">
              {email.subject}({email.mailTo})
            </span>
          ))}
      </Grid>
      <Grid item xs={2} spacing={0} justifyContent="center">
        <Box textAlign="center">
          <Button
            variant="outlined"
            style={{ margin: "auto", display: "block" }}
            onClick={moveRight}
          >
            {" "}
            {">"}
          </Button>
          <br />
          <Button
            variant="outlined"
            style={{ margin: "auto", display: "block" }}
            onClick={moveLeft}
          >
            {" "}
            {"<"}
          </Button>
          <br />
          <Button
            variant="outlined"
            style={{ margin: "auto", display: "block" }}
            onClick={updateData}
          >
            {" "}
            {"Submit"}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <select
          multiple
          size={5}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            onChangeHandler(event, "accept");
          }}
          onClick={(event: React.MouseEvent<HTMLSelectElement>) => {
            if (event.detail === 2) {
              delay(500);
              moveLeft();
            }
          }}
          className="select"
          id="acceptedEmails"
        >
          {emails.accepted &&
            emails.accepted.map((email) => {
              return <option value={email.mailTo}>{email.subject}</option>;
            })}
        </select>

        {/* Display the selected values */}
        {acceptSelected &&
          acceptSelected.map((email) => (
            <span className="color">
              {email.subject}({email.mailTo})
            </span>
          ))}

        {/* <span className="color">{JSON.stringify(emails)}</span> */}
      </Grid>
    </Grid>
  );
};

export default DemoComponent;
