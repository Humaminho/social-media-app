import React, { useEffect, useState } from 'react';
import './styles/mainContent.css';
import InfoSection from './infoSection';
import SearchSection from './searchSection';
import { auth, db } from './firebase-config';
import { collection, getDocs, addDoc, doc } from 'firebase/firestore';
const log = console.log;

export default function MainContent({ setLayer, setBackground, user }) {
	const [request, setRequest] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [movie, setMovie] = useState('');
	const [dropDownList, setDropDownList] = useState([]);
	const [movieData, setMovieData] = useState([]);

	async function getData() {}

	async function saveData() {
    const userId = user;
    console.log(userId)
		try {
			const watchListRef = doc(db, 'watchlist', userId);
			await updateDoc(watchListRef, { movieData });
			console.log('saved to database');
		} catch {
			console.info('failed to save');
		}
	}

	useEffect(() => {
		saveData();
	}, [movieData]);

	useEffect(() => {}, [movieData]);

	useEffect(() => {
		fetchData('Naruto')
			.then((data) => {
				setMovie(data.results[0]);
			})
			.catch((error) => console.warn('Error: ' + error));
	}, []);

	async function fetchData(req) {
		const apiKey = '67e2da4e137cc7ee4732edd315ed8cab';
		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${req}`
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.warn('Error: ' + error);
		}
	}

	async function handleRequest() {
		try {
			const data = await fetchData(request);
			data.results[0]
				? setMovie(data.results[0])
				: console.warn('Not found.');
			const path = data.results[0].backdrop_path;
			setLayer('layer on');
			setTimeout(() => {
				setBackground(`https://image.tmdb.org/t/p/w1280${path}`);
				setLayer('layer');
			}, 500);
		} catch (error) {
			console.warn('Error: ' + error);
		}
	}

	async function handleChange(e) {
		setRequest(e.target.value);
		setSearchInput(e.target.value);

		try {
			const response = await fetchData(searchInput);
			setDropDownList(response.results);
		} catch (error) {
			console.warn('Error: list not retreived');
		}
	}

	function returnMovieData(id) {
		const apiKey = '67e2da4e137cc7ee4732edd315ed8cab';
		fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
			.then((response) => response.json())
			.then((data) => {
				setMovieData([...movieData, data]);
				console.log(data);
			})
			.catch((error) => console.log(error));
	}

	return (
		<div className="main">
			<SearchSection
				dropDownList={dropDownList}
				setDropDownList={setDropDownList}
				searchInput={searchInput}
				setSearchInput={setSearchInput}
				setRequest={setRequest}
				handleRequest={handleRequest}
				handleChange={handleChange}
				request={request}
			/>
			<InfoSection
				movie={movie}
				movieData={movieData}
				setMovieData={setMovieData}
			></InfoSection>
		</div>
	);
}
