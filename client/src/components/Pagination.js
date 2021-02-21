import React from 'react';

/*  REFRENCES -  1. FOR Moving TO TOP ON PAGE BUTTON CLICK
                    1. Just use href with "#" (https://stackoverflow.com/questions/43611173/button-onclick-makes-page-jump-to-top-of-page/43611265)
                    2. Or DO it with JS (add it in onClick function) as shown below (https://www.w3schools.com/howto/howto_js_scroll_to_top.asp) - 
                            <a onClick={() =>  {
                                setPage(page);
                                document.body.scrollTop = 0; // For Safari
                                document.documentElement.scrollTop = 0;
                            }}> {page+1} </a>

 */

const Pagination = (props) => {
    let pages_arr = [];
    for(let i = 0 ; i < props.total_pages ; i++)
        pages_arr[i] = i;

    const changePage = (page) => {
        props.setPage(page);
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE anOpera
    }

    return (
        <ul className="pagination" style = {{textAlign: 'center'}}>
            <li className={props.page === 0 ? "disabled" : "waves-effect"}>
                <a onClick={props.page === 0 ? null : () => changePage(props.page - 1)}><i className="material-icons">chevron_left</i></a>
            </li>
            {
                pages_arr.map(page => (<li className={props.page === page ? "active" :"waves-effect"} key={page}>
                                            <a onClick={() =>  changePage(page)}> {page+1} </a>
                                        </li>))
            }
            <li className={props.page === (pages_arr.length - 1) ? "disabled" : "waves-effect"}>
                <a onClick={props.page === (pages_arr.length - 1) ? null : () => changePage(props.page + 1)}><i className="material-icons">chevron_right</i></a>
            </li>
        </ul>
    );
}

export default Pagination;