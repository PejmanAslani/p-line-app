import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import TextInputCustom from '../../../reuseables/TextInputCustom'

const BulkDeleteUsers = (props: any) => {
  const [state, setState] = useState({
    range: ""
  })
  return (
    <Row>
      <Form >
        <Col md={{ span: 8, offset: 2 }}>
          <h5>Delete Users As Group</h5>
          <hr />
          <Row>
            <TextInputCustom
              name="range"
              label="Range"
              value={state.range}
              placeholder="Example 100-120,125,127,300-310,400,402"
              setState={setState}
            />
          </Row>
          <Button
            variant="primary" type="submit">
            Delete
          </Button>
          {" "}
          <Button
            variant="danger" onClick={() => props.modal(false)}>
            Exit
          </Button>
        </Col>
      </Form>
    </Row>
  )
}

export default BulkDeleteUsers