import axios from "axios";
const baseUrl = 'http://localhost:3001/persons';


const getAllNumbers = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const createNumber = (newPerson) => {
    const request = axios.post(baseUrl, newPerson);
    return request.then(response => response.data);
}

const updateNumber = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson)
    return request.then(response => response.data);
}

const deleteNumber = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data);
}

export default { getAllNumbers, createNumber, updateNumber, deleteNumber }