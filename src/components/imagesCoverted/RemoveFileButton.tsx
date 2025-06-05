import { FaTrashCan } from "react-icons/fa6"

interface RemoveFileButtonProps {
    index: number;
    handleRemoveFile: (index: number) => void;
}  

export const RemoveFileButton = ({ index, handleRemoveFile }: RemoveFileButtonProps) => {
    
    return (
        <button
            onClick={() => handleRemoveFile(index)}
            className="mr-4 text-red-700 hover:text-red-800 flex items-center justify-center cursor-pointer"
            title="Eliminar">
            <p className='text-sm font-medium'>Eliminar</p>
            <FaTrashCan className="text-xl ml-2" />
        </button>
    )
}

export default RemoveFileButton;