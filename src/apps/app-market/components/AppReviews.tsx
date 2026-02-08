import type { MarketAppReview } from '../app-market.types'
import RatingStars from './RatingStars'

interface AppReviewsProps {
  reviews: MarketAppReview[]
}

const AppReviews = ({ reviews }: AppReviewsProps) => {
  if (reviews.length === 0) return null

  return (
    <div className="px-5 py-4 border-t border-white/5">
      <h3 className="text-[13px] font-semibold text-white/70 mb-3">
        Ratings & Reviews
      </h3>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="p-3 rounded-lg bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-white/70 font-medium">
                {review.author}
              </span>
              <RatingStars rating={review.rating} size="xs" />
              <span className="text-[10px] text-white/30 ml-auto">
                {review.date}
              </span>
            </div>
            <p className="text-[12px] text-white/50 mt-1.5 leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppReviews
