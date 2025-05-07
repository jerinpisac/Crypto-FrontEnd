import React from "react";
import Link from "next/link";

function NewsCard({ title, image, url }) {
  return (
    <div className="news-card">
      <Link href={url} passHref>
        <div className="newsimg">
          <img src={image} alt={title} />
        </div>
        <div className="news-content">
          <h4>{title}</h4>
        </div>
      </Link>
    </div>
  );
}

export default NewsCard;
