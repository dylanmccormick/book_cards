import React, {Component} from 'react';
import {useState} from 'react';
import SearchArea from './SearchArea';
import request from 'superagent';
import BookList from './BookList';




class Books extends Component{
	constructor(props){
		super(props);
		this.state = {
			books: [],  //results
			searchField: '', //query
			sort:''
		}
	}

	

	searchBook = (e) => {
		const apiKey = "AIzaSyDGR_uX_BRdyEQ7wo239qtF7tawe5zwbrI";
		e.preventDefault();
		request
			.get( 'https://www.googleapis.com/books/v1/volumes')
			.query({q: this.state.searchField})
			.query({key: apiKey})
			.query({maxResults: '40'})
			.then((data) => {
				console.log(data);
				const cleanData = this.cleanData(data);
				this.setState({ books: cleanData});
			})

	}

	handleSearch = (e) => {
		
		this.setState({searchField: e.target.value})
	}


	handleSort = (e) => {
		this.setState({sort: e.target.value})
	}

	cleanData = (data) => {
		const cleanedData = data.body.items.map((book) => {
			if(book.volumeInfo.hasOwnProperty('publishedDate') === false){
				book.volumeInfo['publishedDate'] = '0000';
			}

			else if (book.volumeInfo.hasOwnProperty('imageLinks')=== false){
				book.volumeInfo['imageLinks'] = {thumbnail: 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg'}
			}


			return book;
		})
		return cleanedData;
	}

	render(){

		const sortedBooks = this.state.books.sort((a,b) => {
			if(this.state.sort === 'Newest'){
				return parseInt(b.volumeInfo.publishedDate.substring(0,4)) - parseInt(a.volumeInfo.publishedDate.substring(0,4))
			}
			else if(this.state.sort === 'Oldest'){
				return parseInt(a.volumeInfo.publishedDate.substring(0,4)) - parseInt(b.volumeInfo.publishedDate.substring(0,4))
			}
		})
		
		return(
			
			<div>
				<SearchArea searchBook={this.searchBook} handleSearch={this.handleSearch}
					handleSort = {this.handleSort}/>	
				<BookList books = {sortedBooks} />
			</div>
		);
	}
}

export default Books;
