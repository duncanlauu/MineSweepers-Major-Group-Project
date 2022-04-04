import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ClubApplicants from "./ClubApplicants";
import ClubFeed from "./ClubFeed";
import LandingProfile from "./LandingProfile";
import ClubScheduling from "./ClubScheduling";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function ClubProfileTabs(props) {
    const [value, setValue] = React.useState(0);
    const memberStatus = props.memberStatus;
    console.log("Member status is: ", memberStatus);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
                    <Tab label="Profile" {...a11yProps(0)} />
                    {(memberStatus !== "notApplied" && memberStatus !== "applied" && memberStatus !== "banned") && (
                        <Tab label="Members" {...a11yProps(1)} />
                    )}
                    {(memberStatus !== "notApplied" && memberStatus !== "applied" && memberStatus !== "banned") && (
                        <Tab label="Feed" {...a11yProps(2)} />
                    )}
                    {(memberStatus !== "notApplied" && memberStatus !== "applied" && memberStatus !== "banned") && (
                        <Tab label="Meetings" {...a11yProps(3)} />
                    )}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <LandingProfile memberStatus={memberStatus} setMemberStatus={props.setMemberStatus}
                                user_id={props.user_id}/>
            </TabPanel>

            {(memberStatus !== "notApplied" && memberStatus !== "applied" && memberStatus !== "banned") && (
                <TabPanel value={value} index={1}>
                    <ClubApplicants memberStatus={memberStatus} club={props.club}/>
                </TabPanel>
            )}

            {(memberStatus !== "notApplied" && memberStatus !== "applied" && memberStatus !== "banned") && (
                <TabPanel value={value} index={2}>
                    <ClubFeed/>
                </TabPanel>
            )}

            {(memberStatus !== "notApplied" && memberStatus !== "applied" && memberStatus !== "banned") && (
                <TabPanel value={value} index={3}>
                    <ClubScheduling/>
                </TabPanel>
            )}
        </Box>
    );
}

export default ClubProfileTabs;
