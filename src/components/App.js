import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import LogItem from './LogItem';
import AddLogItem from './AddLogItem';
import Alert from 'react-bootstrap/Alert';
import { ipcRenderer } from 'electron';

const App = () => {
  const [logs, setLogs] = useState([]);

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success',
  });

  useEffect(() => {
    ipcRenderer.send('logs:load');
    ipcRenderer.on('logs:get', (e, l) => {
      setLogs(JSON.parse(l));
    });
    ipcRenderer.on('logs:clear', () => {
      setLogs([]);
      showAlert('Logs Cleared');
    });
  }, []);

  function addItem(item) {
    if (item.text === '' || item.user === '' || item.priority === '') {
      showAlert('Please Enter Details', 'danger');
      return false;
    }
    ipcRenderer.send('logs:add', item);

    showAlert('Log Added');
  }

  function deleteItem(_id) {
    ipcRenderer.send('logs:delete', _id);
    showAlert('Log Removed');
  }

  function showAlert(message, variant = 'success', seconds = 3000) {
    setAlert({
      show: true,
      message,
      variant,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: '',
        variant: 'success',
      });
    }, seconds);
  }

  return (
    <Container>
      <AddLogItem addItem={addItem} />
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log Text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <LogItem log={l} key={l._id} deleteItem={deleteItem} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
