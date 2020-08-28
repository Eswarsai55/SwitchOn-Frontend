import React from "react";
import {Col, Grid, Row} from "react-bootstrap";


const NotFound = () => (
    <div className="common-wrapper">
        <section className="not-found-section">
            <Grid>
                <Row>
                    <Col md={12}>
                        <div className="not-found-message pd-t-5 pd-b-5 box mg-t-5 mg-b-5">
                            <h1 className="error-message">Page Not Found</h1>
                        </div>

                    </Col>
                </Row>
            </Grid>
        </section>
    </div>
);

export default NotFound;
