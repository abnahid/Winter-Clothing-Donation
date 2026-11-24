/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const Campaign = ({ campaign, index = 0 }) => {
  const {
    title,
    image,
    description,
    division,
    goal,
    current_funds,
    progress,
    id,
  } = campaign;
  const delay = Math.min((index % 6) * 100, 500);

  return (
    <div className="card bg-base-100 rounded-lg" data-aos="fade-up" data-aos-delay={delay}>
      <figure>
        <img src={image} alt={title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p title={description}>{description}</p>
        <h2 className="text-lg font-medium">
          বিভাগ:
          <span className="text-neutral-400 text-base font-medium ml-1">
            {division}
          </span>
        </h2>
        <div className="mt-4">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <div className="flex gap-2 items-center">
              <span>৳{Number(goal).toLocaleString("bn-BD")}</span>
              <div className="text-neutral-400 text-base font-normal">
                সংগৃহীত: ৳{Number(current_funds).toLocaleString("bn-BD")}
              </div>
            </div>
            <span>{Number(progress) || 0}%</span>
          </div>
          <progress
            className="progress progress-primary w-full mt-2"
            value={Number(progress) || 0}
            max="100"
          ></progress>
        </div>
        <div className="card-actions w-full">
          <NavLink to={`/details/${id}`} className="w-full">
            <button className="badge badge-outline p-5 bg-primary text-white font-bold w-full rounded-lg">
              বিস্তারিত দেখুন
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
