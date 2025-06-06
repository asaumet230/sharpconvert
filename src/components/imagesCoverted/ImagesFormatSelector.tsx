import 'animate.css';

interface FormatSelectorProps {
  outputFormat: string;
  setOutputFormat: (format: string) => void;
};

export const FormatSelector = ({ outputFormat, setOutputFormat }: FormatSelectorProps) => {

  return (
    <div className='mt-4 animate__animated animate__fadeIn'>
      <div className='flex flex-col items-center justify-center sm:flex-row'>
        <label className='font-semibold mr-5 mb-3 sm:mb-2 text-xl sm:text-2xl '>Formato de salida:</label>
        <select
          className='p-2 font-semibold text-indigo-600 border-2 border-indigo-300 rounded-md text-base sm:text-lg'
          name='outputFormat'
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}>
          <option value="webp">WEBP</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="jpeg">JPEG</option>
          <option value="avif">AVIF</option>
        </select>
      </div>
    </div>
  )
}

export default FormatSelector;