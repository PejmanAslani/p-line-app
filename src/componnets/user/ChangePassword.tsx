// import React, { useState } from 'react'
// import { Col, Row } from 'react-bootstrap'
// import { Form } from 'react-bootstrap'
// import { Button } from 'react-bootstrap'
// import { useNavigate, useParams } from 'react-router'
// import TextInput from '../reuseables/TextInputCustom'
// import PlineTools, { TypeAlert } from '../services/PlineTools'
// const ChangePassword = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const load = () => {
//     PlineTools.getRequest("/sip-profiles/get-all")
//       .then((result) => {
//         console.log(result);

//       })
//       .catch((error) => {

//         PlineTools.errorDialogMessage("Failed To Get Profiles");
//       })
//       .finally(() => {
//         let id = params.id;
//         if (id !== undefined) {
//           const url = "/sip-trunks/" + id;
//           PlineTools.getRequest(url)
//             .then((result) => {
//               setState(result.data);
//             })
//             .catch(() => {
//               PlineTools.errorDialogMessage("Getting Data failed");
//             });
//         }
//       });
//   };
//   const [state, setState] = useState({
//     oldPasswod: "",
//     newPassword: "",
//     repeatPassword: ""
//   });
//   const saveData = (e: any) => {
//     e.preventDefault();

//     let url = "/sip-trunks";
//     if (state.oldPasswod == null) {
//       url += "/create";
//     } else {
//       url += "/update";
//     }

//     PlineTools.postRequest(url, state)
//       .then((result) => {
//         if (result.data.hasError) {
//           PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
//         }
//       })
//       .catch((error) => {
//         PlineTools.errorDialogMessage("An error occurred while executing your request. Contact the system administrator");
//         console.log(state);
//       });
//   };
//   PlineTools.appAlert
//   const getData = () => {
//     const id = params.id;
//     if (id != undefined) {
//       PlineTools.getRequest("/sip-trunks/get/" + id)
//         .then((result) => {
//           setState(result.data);
//         })
//         .catch(() => {
//           PlineTools.errorDialogMessage("An error occurred while executing your request. Contact the system administrator");
//         });
//     }
//   };

//   return (
//     <form>
//       <Row>
//         <Col md={{ span: 8, offset: 2 }}>
//           <Row>
//             <TextInput
//               label="Old Password"
//               requir={true}
//               value={state.oldPasswod}
//               onChange={(e: any) => {
//                 setState({ ...state, oldPasswod: e.target.value })
//               }} />
//             <TextInput
//               label="New Password"
//               requir={true}
//               value={state.oldPasswod}
//               onChange={(e: any) => {
//                 setState({ ...state, oldPasswod: e.target.value })
//               }} />
//           </Row>
//           <Row>
//             <TextInput
//               label="Repeat Password"
//               requir={true}
//               value={state.repeatPassword}
//               onChange={(e: any) => {
//                 setState({ ...state, repeatPassword: e.target.value })
//               }} />
//             <TextInput
//               label="New Password"
//               requir={true}
//               value={state.oldPasswod}
//               onChange={(e: any) => {
//                 setState({ ...state, oldPasswod: e.target.value })
//               }} />
//           </Row>

//         </Col>
//       </Row>
//       <Button variant="primary" type="submit">Subnit</Button>
//     </form>
//   )
// }

// export default ChangePassword
import React from 'react'

const ChangePassword = () => {
  return (
    <div>ChangePassword</div>
  )
}

export default ChangePassword