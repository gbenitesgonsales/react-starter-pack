// import { toast } from "@/components/sonner";
import axios from "axios";


export const apiV1 = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/`,
})

