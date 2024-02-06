import { UserAuth } from "@/components/auth";
import { useContext } from "react";

import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";

function SignIn() {
    const { loading, SignIn_Kakao, SignIn_Google, Skip_SignIn } = useContext(UserAuth);

    return (
        <main className="flex w-screen h-screen justify-center items-center bg-gradient-to-r from-emerald-500 to-teal-500">
            <div className="flex flex-col justify-start items-start w-11/12 h-11/12 bg-slate-50 rounded-xl shadow-2xl">
                <text className="text-small font-bold ml-4 mt-2">
                    AlexJung Develop
                </text>
                <div className="auth auth-title">
                    <text className="text-title font-extrabold">
                        오늘의 할일
                    </text>
                </div>
                <div className="auth auth-content">
                    <text className="text-small">
                        오늘 해야할 일들을 계획하고 목표를 달성해보세요.
                        <br />
                        설치없이 간편하게 이용하실 수 있습니다.
                    </text>
                </div>
                <div className="auth auth-container">
                    <div className="auth auth-img-container">
                        <img src="undraw_studying_re_deca.svg" />
                    </div>
                    <div className="auth auth-btn-container">
                        {!loading ? (
                            <>
                                <button
                                    className="auth-btn yellow"
                                    onClick={SignIn_Kakao}>
                                    <RiKakaoTalkFill size={10} color={"white"} className="auth-btn-icon" />
                                    <text className="text-small auth-btn-text font-bold tracking-tighter text-white">
                                        카카오톡으로 시작하기
                                    </text>
                                </button>
                                <button
                                    className="auth-btn red"
                                    onClick={SignIn_Google}>
                                    <FaGoogle size={10} color={"white"} className="auth-btn-icon" />
                                    <text className="text-small auth-btn-text font-bold tracking-tighter text-white">
                                        구글로 시작하기
                                    </text>
                                </button>
                                <button
                                    className="auth-btn gray"
                                    onClick={Skip_SignIn}>
                                    <FaLongArrowAltRight size={10} color={"white"} className="auth-btn-icon" />
                                    <text className="text-small auth-btn-text font-bold tracking-tighter text-white">
                                        로그인 없이 시작하기
                                    </text>
                                </button>
                            </>
                        ) :
                            (
                                <div className="auth-spinner">
                                    <RotatingLines
                                    
                                        visible={true}
                                        width="64"
                                        strokeColor="green"
                                        strokeWidth="3"
                                        animationDuration="0.75"
                                        ariaLabel="rotating-lines-loading"
                                    />
                                </div>
                            )}
                    </div>

                </div>
            </div>
        </main>
    );
}

export default SignIn;
