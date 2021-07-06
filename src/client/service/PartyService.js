import axios from "axios";
class PartyService {
  constructor() {
    this.auth = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }

  fetchPartyById(partyID) {
    let url = `/partyinfo/fetchPartyById/${partyID}`;
    console.log(url);
    return this.auth
      .get(`/partyinfo/fetchPartyById/${partyID}`)
      .then((response) => response.data)
      .catch((err) => "error");
  }
  fetchRoleList(partyID){
    let url = `/partyinfo/partyRoleList/${partyID}`;
    return this.auth
      .get(url)
      .then((response)=>response.data)
      .catch((err) => "error");
  }
}
const PartyInfoService = new PartyService();
export default PartyInfoService;
