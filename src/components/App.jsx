import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './contact-form/ContactForm';
import ContactList from './contact-list/ContactList';
import Filter from './filter/Filter';
import styles from './App.module.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      filter: '',
    };
  }

  componentDidMount() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.setState({ contacts: JSON.parse(storedContacts) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevContactsString = JSON.stringify(prevState.contacts);
    const currentContactsString = JSON.stringify(this.state.contacts);

    if (prevContactsString.contacts !== currentContactsString) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  handleFilterChange = event => {
    this.setState({
      ...this.state,
      filter: event.target.value,
    });
  };

  addContact = (name, number) => {
    if (name.trim() === '' || number.trim() === '') return;

    const isDuplicate = this.state.contacts.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      alert(` ${name} is already in contacts!`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    this.setState({
      contacts: [...this.state.contacts, newContact],
      filter: '',
    });
  };

  deleteContact = id => {
    const updatedContacts = this.state.contacts.filter(
      contact => contact.id !== id
    );
    this.setState({
      contacts: updatedContacts,
      filter: '',
    });
  };

  render() {
    this.filteredContacts = this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.state.filter.toLowerCase())
    );
    return (
      <div className={styles.container}>
        <div className={styles.PhonebookContainer}>
          <h1>Phonebook</h1>
          <ContactForm onAddContact={this.addContact} />
        </div>

        <div className={styles.contactsContainer}>
          <h2>Contacts</h2>
          <Filter
            value={this.state.filter}
            onChange={this.handleFilterChange}
          />
          <ContactList
            className={styles.form}
            contacts={this.filteredContacts}
            onDeleteContact={this.deleteContact}
          />
        </div>
      </div>
    );
  }
}
