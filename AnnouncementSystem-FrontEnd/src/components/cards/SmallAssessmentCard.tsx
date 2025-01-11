import React from "react";
import {Assessment} from "../../schema/AssessmentSchema.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStarHalfStroke} from "@fortawesome/free-solid-svg-icons";
import {formatScore} from "../../utils/formatScore.tsx";
import {formatDateSimple} from "../../utils/formatDateSimple.tsx";

interface SmallAssessmentCardProps {
    assessment: Assessment;
}

const SmallAssessmentCard: React.FC<SmallAssessmentCardProps> = ({ assessment }) => {
    return (
        <div className="min-w-60 max-w-60 flex flex-col gap-1 place-content-center border-solid border-2 p-4 border-gray-300 rounded-3xl
                       hover:border-blue-500 hover:cursor-pointer hover:shadow-blue-100 hover:shadow-md
        ">
            <div className="text-end text-xs">{formatDateSimple(assessment.date)}</div>
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