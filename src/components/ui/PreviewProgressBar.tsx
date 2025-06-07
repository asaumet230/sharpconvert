import 'animate.css';

interface ProgressBarProps {
    globalProgress: number;
}

export const PreviewProgressBar = ({ globalProgress }: ProgressBarProps) => {

    return (
        <div className="w-7/12 sm:w-5/12 mb-2 mx-auto animate__animated animate__fadeIn">
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${globalProgress}%` }}
                />
                <span className={`absolute inset-0 flex items-center justify-center ${globalProgress > 50 ? 'text-white' : 'text-gray-900'} font-semibold text-sm`}>
                    {globalProgress}%
                </span>
            </div>
        </div>
    )
}

export default PreviewProgressBar;