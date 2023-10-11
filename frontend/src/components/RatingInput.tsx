import { RadioGroup, Radio } from '@nextui-org/react'
/* eslint-disable react/prop-types */

interface RatingInputProps {
  onRatingChange: (rating: string) => void
  initialRating?: number
}

const RatingInput: React.FC<RatingInputProps> = ({ onRatingChange, initialRating }) => {
  const handleRatingChange = (value: string) => {
    onRatingChange(value)
  }

  return (
    <RadioGroup
      label="Select your rating"
      orientation="horizontal"
      onChange={(e) => { handleRatingChange(e.target.value) }}
      value={(initialRating != null) ? String(initialRating) : undefined}
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <Radio key={rating} value={String(rating)}>
          {rating}
        </Radio>
      ))}
    </RadioGroup>
  )
}

export default RatingInput
