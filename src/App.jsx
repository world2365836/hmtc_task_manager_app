import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TaskForm from './component/TaskForm';
import TaskConfirmation from "./component/TaskConfirmation";
import './App.css';
import GlobalError from './component/GlobalError';
import { useSelector } from 'react-redux';

function AppContent() {
const {  success } = useSelector((state) => state.task);



const year=new Date().getFullYear();



  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>HMCTS Task Management System</h1>
          <p>Create and manage tasks for HMCTS caseworkers</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <GlobalError />
          <div className="content-wrapper">

            <div className="form-section">
              <div className="form-container">
                <TaskForm />
              </div>
            </div>
            {success &&
            <div className="confirmation-section">
              <div className="confirmation-container">
                <TaskConfirmation />
              </div>
            </div>}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>HMCTS Task Management System ©{year}</p>
        <p className="footer-note">
          For HMCTS caseworkers to track and manage tasks effectively
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;