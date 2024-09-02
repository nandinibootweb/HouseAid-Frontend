import ENVConfig from "../../Utils/env.config";
import axios from "axios";
import formatDate from "../../Utils/formatDate";
import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
} from "@nextui-org/react";
import { FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Mod_AcceptRejectOffer from "./Mod_AccepRejectOffer";
import PleaseLogin from "../PleaseLogin";
import { AuthContext } from "../../context/AuthProvider";

//Data Table for logged in user Requests where rStatus < 2
const UD_MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPage, setShowLoginPage] = useState(false); // to manage state when Axios fetch is having an error
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getRequests = async () => {
      try {
        const res = await axios.get(
          `${ENVConfig.API_ServerURL}/requests?rUserId=${user._id}&rStatus=0`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data) {
          // console.log(res.data);
          setRequests(res.data);
        }
      } catch (error) {
        // Check if the error response exists and display the error message
        if (error.response) {
          console.error(
            `(${error.response.status}) ${error.response.data.error}`
          );
        } else {
          console.log("An unknown error happened: ", error);
        }
        setShowLoginPage(true); // Show the login page on error
      }
      setIsLoading(false);
    };

    getRequests();
  }, []);

  const deleteRequestById = async (id) => {
    try {
      await axios.delete(`${ENVConfig.API_ServerURL}/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRequests(requests.filter((request) => request._id !== id));
    } catch (error) {
      // Check if the error response exists and display the error message
      if (error.response) {
        console.error(
          `(${error.response.status}) ${error.response.data.error}`
        );
      } else {
        console.log("An unknown error happened: ", error);
      }
    }
  };

  const viewDetails = (id) => {
    navigate(`/request-details/${id}`);
  };

  const statusLabels = {
    0: "Awaiting Offer",
    1: "Offer Received",
    5: "Offer Accepted",
    6: "In Progress",
    9: "Finished",
  };

  const columns = [
    { key: "rStatus", label: "STATUS" },
    { key: "rCategory", label: "REQUEST CATEGORY" },
    { key: "rText", label: "REQUEST TEXT" },
    { key: "rDate", label: "REQUEST DATE" },
    { key: "rImage", label: "REQUEST IMAGE(ES)" },
    { key: "offerCount", label: "PENDING OFFERS" },
    { key: "actions", label: "ACTIONS" }, // New column for action buttons
  ];
  // If showLoginPage is true, render the PleaseLogin component
  if (showLoginPage) {
    return <PleaseLogin />;
  }

  return (
    <div className="">
      <Table
        isHeaderSticky
        color="primary"
        selectionMode="single"
        defaultSelectedKeys={["2"]}
        isStriped
        aria-label="Expandable table with dynamic content"
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={requests}>
          {requests.map((item) => (
            <TableRow key={item._id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === "rStatus" ? (
                    statusLabels[item[column.key]] || "Unknown Status"
                  ) : column.key === "rDate" ? (
                    formatDate(item[column.key])
                  ) : column.key === "offerCount" ? (
                    <Mod_AcceptRejectOffer
                      id={item._id}
                      setRequests={setRequests}
                    />
                  ) : column.key === "rImage" ? (
                    item.rImage.length > 0 ? (
                      `${item.rImage.count} Image(s) available`
                    ) : (
                      "No image available"
                    )
                  ) : column.key === "actions" ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        auto
                        icon={<FaTrash />}
                        color="error"
                        onClick={() => deleteRequestById(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    item[column.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UD_MyRequests;
