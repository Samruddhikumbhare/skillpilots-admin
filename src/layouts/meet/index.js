import React, { useState } from "react"; // Import useState from React
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { JitsiMeeting } from "@jitsi/react-sdk";

function Meet() {
  // Set a default room name
  const [roomName, setRoomName] = useState("skillpilots"); // Default room name

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ height: "calc(100vh - 64px)", width: "100%", display: "flex" }}>
        {/* Adjust height and width to full viewport minus navbar height */}
        <JitsiMeeting
          roomName={roomName} // Use the state variable for the room name
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          userInfo={{
            displayName: "Skillpilots",
          }}
          onApiReady={(externalApi) => {
            // You can attach custom event listeners to the Jitsi Meet External API
            // or store it locally to execute commands
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%"; // Set the iframe height to 100%
            iframeRef.style.width = "100%"; // Set the iframe width to 100%
          }}
        />
      </div>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Meet;
