import axiosInstance from "./axios";

export const downloadCalendar = (meeting_id) => {
    console.log(meeting_id)
    axiosInstance
        .get(`calendar/${meeting_id}`, {})
        .then((res) => {
            // This solution taken from https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
            const element = document.createElement("a");
            const file = new Blob([res.data], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = "event.ics";
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        })
}
