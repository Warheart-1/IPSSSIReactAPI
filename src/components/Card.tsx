import { useEffect, useState } from "react"

enum HTTP_STATUS {
	OK = 200,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
}

enum EMOJI {
	"😍" = 10,
	"💖" = 9,
	"✨" = 8,
	"👍" = 7,
	"🙂" = 6,
	"😐" = 5,
	"😕" = 4,
	"😞" = 3,
	"😖" = 2,
	"🤮" = 1,
}

type DataProps = {
	data : AnimesProps[];
	pagination: PaginationProps;
	status: HTTP_STATUS;
}

type PaginationProps = {
	current_page: number;
	has_next_page: boolean;
	items : {
		count : number;
		per_page : number;
		total : number;
	};
	last_visible_page: number;
}

type AnimesProps = {
	mal_id: number;
	url: string;
	title: string;
	status: string;
	images: {
		webp : {
			image_url: string,
			small_image_url: string,
			large_image_url: string,
		},
	};
	start_date: string;
	end_date: string;
	synopsis: string;	
	score : number;
	rank : number;
}

export default function Card() {
	const [animesList, setAnimeList] = useState<AnimesProps[]>();

	useEffect(() => {
		(async() => {
			try{
				const request : Response = await fetch("https://api.jikan.moe/v4/seasons/now");
				if(request.status !== HTTP_STATUS.OK) throw new Error("Internal Server Error : " + request);
				const data : DataProps = await request.json();
				setAnimeList(data.data);
			}catch (error){
				throw new Error("Internal Server Error : " + error);
			}
		})();
	}, [])

	const emoji = (score : number) => {
		return Object.keys(EMOJI).map((key : string) => {
			if(score >= EMOJI[key as keyof typeof EMOJI]) return key;
		});
	}

	return (
		<>
			{animesList && animesList.map((anime : AnimesProps, index) => {
				return (
					<div key={index} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					    <a href="#">
					        <img className="p-8 rounded-t-lg" src={anime.images.webp.large_image_url} alt="product image" />
					    </a>
					    <div className="px-5 pb-5">
					        <a href="#">
					            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{anime.title}</h5>
					        </a>
					        <div className="flex items-center mt-2.5 mb-5">
					           	<span>{emoji(Math.floor(anime.score))}</span>
					            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">{anime.score}</span>
					        </div>
					        <div className="flex items-center justify-between">
					            <span className="text-3xl font-bold text-gray-900 dark:text-white">{anime.rank}e</span>
					            <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">View more</a>
					        </div>
					    </div>
					</div>
				)
			})}
		</>
	)
}