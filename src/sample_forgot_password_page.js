import React, { useState } from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { useInterval } from "./hooks";
import "./assets/css/main.css";

// import env from 'env'

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const ErrorMsg = ({ msg }) => <span className="text-error text-[11px] pt-2 font-medium ">{msg}</span>;

/**
 *
 * @param {{msg:string}} param0
 * @returns
 */
const SuccessMsg = ({ msg }) => <span className="text-success text-[11px] pt-2 font-medium ">{msg}</span>;

export const Sample_forgot_password_page = () => {
  const forgotPasswordApi = process.env.FORGOT_PASSWORD_API || `http://localhost:5000/sample_forgot_password_fn`;
  const forgotPasswordPageUrl = process.env.FORGOT_PASSWORD_PAGE_URL || "http://localhost:4011";

  const [emailsent, setEmailSent] = useState(false);
  const [seconds, setSeconds] = useState(30);

  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm();

  useInterval(
    () => {
      setSeconds(seconds - 1);
    },
    seconds > 0 && emailsent ? 1000 : null
  );

  return (
    <div className="w-full float-left flex sm:block bg-white sm:mt-16">
      <div className="w-full flex flex-col items-center sm:justify-center pt-16 sm:p-2 main-wraper">
        <div className="w-full sm:max-w-[420px] bg-white sm:border sm:border-mid-gray sm:rounded-sm sm:min-h-0 p-8 sm:p-16 sm:shadow-lg min-h-screen">
          <div className="text-lg text-light-black font-bold mb-6">Reset Password</div>
          <div className="text-grey text-[13px] mt-4">
            Enter your registered e-mail address to recieve password reset link & follow the instructions
          </div>
          <div className="w-full float-left pb-4 mt-6">
            <form
              className="w-full float-left mb-0"
              onSubmit={handleSubmit(async (data) => {
                const _j = await fetch(forgotPasswordApi, {
                  method: "POST",
                  body: JSON.stringify(data),
                });
                const response = await _j.json();
                if (_j.status === 500 && response.err) {
                  setError("email", { type: "serverError" }, { shouldFocus: true });
                  return;
                }
                if (_j.status === 200 && !response.err) {
                  setEmailSent(true);
                  return;
                }
              })}
            >
              <div className="flex flex-col mb-3">
                <label className="text-black font-almost-bold text-sm">E-mail*</label>
                <input
                  className={classnames(
                    "w-full mt-2.5 px-4 py-3 bg-light-gray border focus:outline-none rounded-sm text-sm font-almost-bold text-light-black",
                    {
                      "border-light-gray": !errors.email,
                      "focus:border-primary": !errors.email,
                    },
                    {
                      "border-error": errors.email,
                      "focus:border-error": errors.email,
                    },
                    {
                      "border-success": !errors.email && emailsent,
                      "focus:border-success": !errors.email && emailsent,
                    }
                  )}
                  type="text"
                  {...register("email", {
                    required: true,
                    validate: {
                      serverError: (_) => {},
                    },
                  })}
                  placeholder="Gibinmichael@gmail.com"
                  id="email"
                />
                {errors.email && errors.email.type === "serverError" && <ErrorMsg msg="email not sent, server error" />}
                {emailsent && <SuccessMsg msg="email sent successfully" />}
              </div>
              <div className="flex flex-col button-wrapper w-full mt-6">
                <button
                  className="w-full rounded-sm py-3 focus:outline-none font-heavy text-white text-md  bg-primary disabled:bg-gray transition-all"
                  type="submit"
                  disabled={!isValid || emailsent}
                >
                  Send Reset Link
                </button>
                <p className="w-full text-sm text-grey mt-6">
                  Didn't get link?
                  <a
                    className={classnames({
                      "text-primary cursor-pointer hover:underline underline-offset-4 focus:outline-none":
                        seconds === 0,
                      "inline-block text-gray underline underline-offset-4": seconds > 0,
                    })}
                    href={emailsent && !seconds ? forgotPasswordPageUrl : undefined}
                  >
                    &nbsp; Request new link {emailsent && seconds !== 0 && `in ${seconds}s`}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sample_forgot_password_page;
