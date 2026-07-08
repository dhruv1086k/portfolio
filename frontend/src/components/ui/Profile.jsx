import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaG, FaXTwitter } from "react-icons/fa6";

export default function Profile() {
    return (
        <div className="group/profile flex h-52 w-52 flex-col items-center justify-center rounded-3xl bg-[#C84B2D]/10 border border-[#C84B2D]/25 p-4 shadow-sm transition-shadow duration-300 hover:shadow-black/25 max-sm:hidden">
            <img
                alt="Profile avatar"
                src="/lanyardPhoto.png"
                className="h-16 w-16 rounded-full object-cover duration-300 ease-in-out"
            />

            <div className="mt-2 flex flex-col items-center justify-center">
                <h3 className="font-sans font-semibold text-[#f0ebe0]">
                    Dhruv Pal
                </h3>
                <p className="text-sm font-light text-[rgba(240,235,224,0.6)]">
                    The last air bender
                </p>
            </div>

            <div className="mt-2 flex w-full flex-row justify-evenly rounded-3xl bg-[#1a1815]/70 p-2 text-[#f0ebe0]">
                <a
                    href="https://x.com/?lang=en&mx=2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaXTwitter
                        size={18}
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </a>
                <a
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaLinkedin
                        size={16}
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </a>
                <a
                    href="https://.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub
                        size={16}
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </a >
            </div >
        </div >
    );
}