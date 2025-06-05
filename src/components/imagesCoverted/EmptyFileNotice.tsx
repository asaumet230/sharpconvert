import React from 'react'


interface EmptyFileNoticeProps {
    noticeText?: string;
}

export const EmptyFileNotice = ({ noticeText }: EmptyFileNoticeProps) => {
    return (
        <div className="text-center text-gray-500 text-sm font-medium">
            { noticeText }
        </div>
    )
}

export default EmptyFileNotice