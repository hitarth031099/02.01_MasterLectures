import {gql} from '@apollo/client';

const GET_EMPLOYEES = gql`
  query {
    employees {
      _id
      firstName
      lastName
      employer {
        name
        _id
      }
    }
  }
`;

const GET_EMPLOYERS = gql`
  query {
    employers {
      name
      _id
    }
  }
`;

const GET_EMPLOYERS_WITH_EMPLOYEES = gql`
  query {
    employers {
      _id
      name
      numOfEmployees
      employees {
        _id
        firstName
        lastName
      }
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation createEmployee(
    $firstName: String!
    $lastName: String!
    $employerId: Int!
  ) {
    addEmployee(
      firstName: $firstName
      lastName: $lastName
      employerId: $employerId
    ) {
      _id
      firstName
      lastName
      employer {
        name
        _id
      }
    }
  }
`;

const ADD_EMPLOYER = gql`
  mutation createEmployer($name: String!) {
    addEmployer(name: $name) {
      _id
      name
      numOfEmployees
      employees {
        firstName
        lastName
        _id
      }
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: String!) {
    removeEmployee(_id: $id) {
      _id
      firstName
      lastName
      employer {
        name
        _id
      }
    }
  }
`;

const EDIT_EMPLOYEE = gql`
  mutation changeEmployee(
    $id: String!
    $firstName: String
    $lastName: String
    $employerId: Int
  ) {
    editEmployee(
      _id: $id
      employerId: $employerId
      firstName: $firstName
      lastName: $lastName
    ) {
      _id
      firstName
      lastName
      employer {
        _id
        name
      }
    }
  }
`;

let exported = {
  ADD_EMPLOYEE,
  GET_EMPLOYEES,
  GET_EMPLOYERS,
  DELETE_EMPLOYEE,
  GET_EMPLOYERS_WITH_EMPLOYEES,
  ADD_EMPLOYER,
  EDIT_EMPLOYEE
};

export default exported;
