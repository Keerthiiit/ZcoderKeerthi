import { io } from "socket.io-client";
import API from "../config/api";

const socket = io(API);

export default socket;