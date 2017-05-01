import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { API_URL } from '../../actions/index';
import axios from 'axios';

class HomePage extends Component {

  	/**
   	* Class constructor.
   	*/
	constructor(props, context) {
		super(props, context);
		this.state = {
		  category :"",
		  posts: [],
		  loading: true,
		  error: null
		};
	}

	componentDidMount() {
		console.log("HERE")
		debugger
		axios.get(`${API_URL}/getExpertsCategoryList`)
		  .then(res => {
		  	debugger
		    const posts = res.data.map(obj => obj);
		    this.setState({
		      posts,
		      loading: false,
		      error: null
		    });
		  })
		  .catch(err => {
		    // Something went wrong. Save the error in state and re-render.
		    this.setState({
		      loading: false,
		      error: err
		    });
	  	});
	}

	renderLoading() {
	   return <img className="loader-center" src="/src/public/img/ajax-loader.gif"/>;
	}

	renderError() {
	return (
	  <div className="error-message">
	    Uh oh: {this.state.error.message}
	  </div>
	);
	}

	getStars(rating) {
	var size = Math.max(0, (Math.min(5, rating))) * 16;
	return Object.assign(
	  {width:size}
	);
	}

	getStyles(color) {
		return Object.assign(
		  {'background':color}
		);
	}

  renderPosts() {
    if(this.state.error) {
      return this.renderError();
    }
    debugger

    return (
         <div id="experts-list" className="experts-list">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div id="homePage">
                              {this.state.posts.map((post, index) => (
                                <div key={post.id} className={ "col-md-3 "+ ( post.name == 'Music Lessons' ? 'music-lessions-list-wrapper' : '' ) }>
                                  <h4 className="center_h4">
																		<a href="javascript:void()">{post.name}</a>
																		<span className="long-dash"></span>
																		<span className="short-dash"></span>
																		<span className="short-dash"></span>
																	</h4>
																	{/*console.log(post)*/}
                                  <ul className="topics">
                                    {post.subcategory.map(subcat =>
                                      <li key={subcat.id}>
                                      	<Link to={`/list/${subcat.name}`}>{subcat.name}
                                      	</Link>
                                      	{console.log(subcat)}
                                      </li>
                                      
                                    )}
                                  </ul>
                                </div>
                              ))}
                          </div>
                    </div>
                </div>
            </div>
      </div>
    );
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        {this.state.loading ?
          this.renderLoading()
          : this.renderPosts()}
      </div>
    );
  }
}


export default HomePage;
