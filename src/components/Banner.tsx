interface BannerProps {
	title : string;
	tailwind_class : string;
	onclick : () => void;
}



export default function Banner ({...props} : BannerProps){
	return (
		<>
			<h1>{props.title}</h1>
		</>
	)
}