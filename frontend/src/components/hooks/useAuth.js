// from https://github.com/gitdagray/react_protected_routes/blob/a16142d7e2ce2269f360541d663e15d731102cb4/src/hooks/useAuth.js

import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;