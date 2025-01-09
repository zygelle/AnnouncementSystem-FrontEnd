import React from "react";
import {AssessmentSchema} from "../../schema/AssessmentSchema.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStarHalfStroke} from "@fortawesome/free-solid-svg-icons";

interface SmallAssessmentCardProps {
    assessment: AssessmentSchema;
}

const SmallAssessmentCard: React.FC<SmallAssessmentCardProps> = ({ assessment }) => {

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        return new Date(date).toLocaleDateString('pt-BR', options);
    };
    const formatScore = (score: number) => {
        return score.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    };

    return (
        <div className="min-w-60 max-w-60 flex flex-col gap-1 place-content-center border-solid border-2 p-4 border-gray-300 rounded-3xl
                       hover:border-blue-500 hover:cursor-pointer hover:shadow-blue-100 hover:shadow-md
        ">
            <div className="text-end text-xs">{formatDate(assessment.date)}</div>
            <div className="text-md col-span-2 font-semibold line-clamp-1">{assessment.title}</div>
            <div className="line-clamp-4">{assessment.description}</div>
            <div className="text-end">by {assessment.evaluatorUser.name}</div>
            <div className="text-md font-medium text-end">
                <FontAwesomeIcon icon={faStarHalfStroke} className="me-1 text-yellow-400"/>
                {formatScore(assessment.grade)}
            </div>
        </div>

    );
};

export default SmallAssessmentCard;