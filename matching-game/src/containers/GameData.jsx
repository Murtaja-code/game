import React, { useEffect, useState } from "react"
import axios from "axios"
import shuffle from "lodash.shuffle"
import "./style.css"

export default function GameData() {
	const [images, setImages] = useState()
	const [match, setMatch] = useState([])
	const [win, setWin] = useState(false)
	const [page, setPage] = useState(Math.floor(Math.random() * 10))
	const [turns, setTurns] = useState(3)
	const mark = [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false
	]
	const [box, setBox] = useState(mark)

	useEffect(() => {
		fetchImages()
	}, [page])

	const fetchImages = () => {
		axios
			.all([
				axios.get(`https://picsum.photos/v2/list?page=${page}&limit=8`),
				axios.get(`https://picsum.photos/v2/list?page=${page}&limit=8`)
			])
			.then(([images1, images2]) => {
				setImages(shuffle(images1.data.concat(images2.data)))
			})
	}
	useEffect(() => {
		if (match.length === 2) {
			if (match[0] === match[1]) {
				setWin(true)
			} else {
				setTimeout(() => {
					setBox(mark)
				}, 1500)
				setTurns(turns - 1)
			}
			setMatch([])
		}
	}, [match])
	const handleBox = (i, url) => {
		let newBox = [...box]
		newBox[i] = true
		setBox(newBox)
		let newMatch = [...match]
		newMatch.push(url)
		setMatch(newMatch)
	}

	const playAgain = () => {
		setPage(page + 1)
		setTurns(3)
		setWin(false)
		setMatch([])
		setBox(mark)
	}
	if (!images) {
		return <div>loading...</div>
	}

	return (
		<div>
			<h3>Card Match Game</h3>
			<p>simply flip two matching cards!</p>
			{win ? <h1 className="win-col">you won</h1> : ""}
			<p>you have {turns} turns</p>

			{turns !== 0 ? (
				<div className="flex">
					{images.map((image, i) => (
						<div key={i}>
							{!box[i] ? (
								<p onClick={() => handleBox(i, image.url)} className="box">
									{i}
								</p>
							) : (
								<img width="80" src={image.download_url} alt="dd" />
							)}
						</div>
					))}
				</div>
			) : (
				<h1 className="lose-col">you lost</h1>
			)}
			<button onClick={() => playAgain()}>play again</button>
		</div>
	)
}
