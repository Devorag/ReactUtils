import { useForm } from "react-hook-form"
import { getUserStore } from "./UserStore";
import { useState } from "react";
import { useStore } from "zustand";

type forminput = { username: string, password: string }

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<forminput>();
    const apiiurl = "http://localhost:5016/api/";
    const useUserStore = getUserStore(apiiurl);
    const login = useUserStore((state) => state.login);
    const logout = useUserStore((state) => state.logout);
    const username = useUserStore((state) => state.userName);
    const isLoggedIn = useUserStore(state => state.isLoggedIn);
    const [crashmsg, setCrashmsg] = useState("");
    const errormsg = useUserStore(state => state.errorMessage);
    const onSubmit = async (data: forminput) => {
        try {
            setCrashmsg("");
            await login(data.username, data.password);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                setCrashmsg(error.message);
            }
            else {
                setCrashmsg("error");
            }
        }
    };

    return (
        <>
            <div>Logged In = {isLoggedIn.toString()}</div>
            <h2 className="text-danger">{crashmsg} || {errormsg}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Username</label>
                <input type="text" {...register('username', { required: 'Username is required' })} />
                {errors.username && <span>{errors.username.message}</span>}
                <br />
                <label>Password</label>
                <input type="password"
                    {...register('password', { required: 'Password is required' })} />
                {errors.password && <span>{errors.password.message}</span>}
                <br />
                <button type="submit">Login</button>

            </form>
            <button onClick={() => logout(username)}>Logout</button>
        </>
    )
}
