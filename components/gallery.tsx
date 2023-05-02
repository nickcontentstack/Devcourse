import React, { useState } from "react";

const GalleryReact = ({ data, heading, showFilter }: { data: any, heading: any, showFilter: boolean }) => {
    const [items, setItems] = useState(data);
    const [active, setActive] = useState(false);
    const filterItem = (categItem: string) => {
        const updateItems = data?.filter((curElem: { powers: string[]; }) => {
            return curElem.powers[0] === categItem[0];
        });
        setItems(updateItems);
        setActive(true);
    };
    console.log('showFilter :>> ', showFilter);

    return (
        <>
            {
                heading ?
                    <>
                        <nav className="navbar navbar-light bg-light shadow-sm mt-2">
                            <span className="navbar-brand mb-0 m-auto h1 text-center">
                                {heading}
                            </span>
                        </nav><br />
                    </>
                    : ''
            }

            <div className="container">
                <div className="row">
                    <div className={`col-sm-3 ${showFilter === false ? 'd-none' : ' '}`}>
                        <hr />
                        <ul className="superhero-nav">
                            {
                                data ?
                                    data?.map((data: { powers: string; }, indx: { toString: () => any; }) => (
                                        data?.powers[0] ?
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault"
                                                    id="flexRadioDefault2"
                                                    onClick={() => filterItem(data?.powers)}
                                                    value={data?.powers}
                                                />
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    {data?.powers}
                                                </label>
                                            </div>
                                            : ''
                                    ))
                                    : ''
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault"
                                    id="flexRadioDefault2"
                                    onClick={() => setItems(data)}
                                    value='flexRadioDefault'
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                    All
                                </label>
                            </div>
                        </ul>
                        <hr />
                    </div>
                    <div className={`${showFilter === false ? 'col-12' : 'col-sm-9 '}`}>
                        <div className="container-fluid mt-4">
                            <div className="row justify-content-center">
                                {items?.map((elem: { id: any; title: any; image: any; description: any; powers: any; }) => {
                                    const { id, title, image, description, powers } = elem;
                                    return (
                                        <>
                                            <div className="col-sm-4" id={id}>
                                                <div className="card mb-5">
                                                    <div className="card-body gallery-card-body ">
                                                        <img className={`img-fluid ${showFilter === false ? 'large-img' :''}`}src={image?.url} alt={image?.filename} />
                                                        <div className="px-2">
                                                            <h5 className="card-title mb-2">{title}</h5>
                                                            <div className="mb-3">Power: {powers}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default GalleryReact;
