import { Button, createStyles, makeStyles, Snackbar, Theme } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useRef, useState } from 'react';
import ReactCodeInput from 'react-code-input';

interface AdminPageProps {
  adminAuth: boolean;
  handleAdminAuth: (pincode: any) => boolean;
}

const Alert = (props: AlertProps) => <MuiAlert elevation={6} variant="filled" {...props} />;

const pincodeLength = 6;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pinCode: {
      margin: 'auto',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 200,
    },
    snackbar: {
      width: '100%',
      marginTop: 60,
      '& > * + *': {
        marginTop: 75,
      },
    },
  })
);

const AdminPage: React.FC<AdminPageProps> = ({ adminAuth, handleAdminAuth }) => {
  const classes = useStyles();

  const [pincode, setPincode] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handlePinCodeChange = (data: any) => setPincode(data);

  const handleLogin = () => {
    setFeedbackOpen(true);
    setAuthSuccess(handleAdminAuth(pincode));
    clearPincode();
  };

  const handleFeedbackClose = () => setFeedbackOpen(false);

  const feedbackMessage = authSuccess ? 'Login geslaagd' : 'Verkeerde pincode';

  const codeRef = useRef<any>(null);

  const clearPincode = () => {
    if (codeRef.current.textInput[0]) codeRef.current.textInput[0].focus();
    for (let i = 0; i < pincodeLength; i++) {
      codeRef.current.state.input[i] = '';
    }
    setPincode('');
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2500}
        open={feedbackOpen}
        onClose={handleFeedbackClose}
        key="feedback"
        className={classes.snackbar}
      >
        <Alert severity={authSuccess ? 'success' : 'error'} onClose={handleFeedbackClose}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
      {!adminAuth && (
        <div className={classes.pinCode}>
          <ReactCodeInput
            ref={codeRef}
            name="admin-pin"
            inputMode="numeric"
            type="password"
            fields={pincodeLength}
            onChange={handlePinCodeChange}
            value={pincode}
          />
          <Button disabled={pincode.length < pincodeLength} variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      )}
      {adminAuth && <p>Admin login geslaagd</p>}
    </>
  );
};

export default AdminPage;
