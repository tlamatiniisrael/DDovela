/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SQLite from 'react-native-sqlite-storage';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


//const db = SQLite.openDatabase({ name: 'gastos.db', location: 'default' });
const db = SQLite.openDatabase(
  {
    name: 'SQLite',
    location: 'Documents',
    //createFromLocation: '~SQLite.db',
  },
  () => { },
  error => {
    console.log("ERROR: " + error);
  }
);


//insert a new user record
const createUser = () => {
  let sql = "INSERT INTO users (email, name) VALUES (?, ?)";
  let params = ["yoursocialmd@gmail.com", "MD Sarfaraj"]; //storing user data in an array
  db.executeSql(sql, params, (result) => {
    console.log("Success", "User created successfully.");
  }, (error) => {
      console.log("Create user error", error);
  });
};

//list all the users
const listUsers = async () => {
  let sql = "SELECT * FROM users";
  db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, resultSet) => {
          var length = resultSet.rows.length;
          for (var i = 0; i < length; i++) {
              console.log(resultSet.rows.item(i));
          }
      }, (error) => {
          console.log("List user error", error);
      })
  })
};

//update user record
const updateUser = () => {
  let sql = 'UPDATE users SET email = ?, name = ? WHERE id = ?';
  let params = ['yoursocialmd@gmail.com', "Mohammad Sarfaraj", 1];
  db.executeSql(sql, params, (resultSet) => {
    console.log("Success", "Record updated successfully");
  }, (error) => {
      console.log(error);
  });
};

//delete user record
const deleteUser = () => {
  let sql = "DELETE FROM users WHERE id = ?";
  let params = [1];
  db.executeSql(sql, params, (resultSet) => {
    console.log("Success", "User deleted successfully");
  }, (error) => {
      console.log("Delete user error", error);
  })
};


function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    createUserTable(); //call create table function here
    createUser();
    listUsers();
  })
  //create table function
  const createUserTable = () => {
    db.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR, name VARCHAR)", [], (result) => {
        console.log("Table created successfully");
    }, (error) => {
        console.log("Create table error", error)
    })
  };
  

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <Section title="Gastos">
            Gastos realizados del Diario.
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
