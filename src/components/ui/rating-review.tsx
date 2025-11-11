import React from "react";

const RatingReview = ({ rating }: { rating: number }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <span
            key={star}
            className="start"
            style={{
              cursor: "pointer",
              color: rating >= star ? "#F5A700" : "#C4C4C4",
              fontSize: `25px`,
            }}
            // onClick={() => {
            //   setRating(star)
            // }}
          >
            {" "}
            ★{" "}
          </span>
        );
      })}
    </div>
  );
};

export default RatingReview;
