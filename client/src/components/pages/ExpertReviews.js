'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class ExpertReviews extends React.Component {
  render() {
    return (
      <div>
        <div className="col-sm-12">
           <div className="review-outside">
              <div className="review-section-wrap">
                 <div className="review-star">
                    <span>4.5 <span>★</span></span>
                    <h3>Just wow!</h3>
                 </div>
                 <div className="comment-review">
                    <p>Grt delivery,nic handy one, overall its superb for this price</p>
                 </div>
              </div>
              <div className="review-section-wrap">
                 <div className="review-star">
                    <span>5 <span>★</span></span>
                    <h3>Just wow!</h3>
                 </div>
                 <div className="comment-review">
                    <p>Grt delivery,nic handy one, overall its superb for this price</p>
                 </div>
              </div>
              <div className="view-all-wrap">
                 <a href="#">  View all reviews</a>
              </div>
           </div>
        </div>
      </div>
    );
  }
}
