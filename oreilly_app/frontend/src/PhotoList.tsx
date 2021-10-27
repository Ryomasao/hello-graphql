import { Photo } from "./models";

type Props = {
	photos: Photo[]
}

const PhotoList = (props:Props) => {
	return (
		<div>
			{props.photos.map((p) => (
				<img key={p.id} src={p.url} alt={p.id} />
			))}
		</div>
	)
}

export default PhotoList