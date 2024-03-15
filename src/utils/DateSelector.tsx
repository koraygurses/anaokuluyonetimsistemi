import { Component, useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
import AysUtils from "./AysUtils";

interface Props {
  dateAsMs?: number;
  date?: Date; // => daha implement edilmedi
  required?: boolean
}

class DateSelector extends Component<Props> {
  //burda bişi var ama bakıcaz
  dayRef = useRef<HTMLSelectElement>(null);
  monthRef = useRef<HTMLSelectElement>(null);
  yearRef = useRef<HTMLSelectElement>(null);

  constructor(props: Props) {
    super(props);
  }

  public getDate(): Date | undefined {
    if (this.yearRef.current && this.monthRef.current && this.dayRef.current) {
      return new Date(
        parseInt(this.yearRef.current.value, 10),
        parseInt(this.monthRef.current.value, 10),
        parseInt(this.dayRef.current.value, 10)
      );
    } else {
      return undefined;
    }
  }

  public getDateAsMs(): number | undefined {
    return (this.getDate() as Date).getTime();
  }

  public getDay(): number | string | undefined {

    if (this.props.dateAsMs) {
      return new Date(this.props.dateAsMs).getDate();
    }

    if (this.props.date) {
      return this.props.date.getDate();
    }

    if (this.dayRef.current) {
      return this.dayRef.current.value;
    }
  }

  public getMonth(): number | string | undefined {
    if (this.props.dateAsMs) {
      return new Date(this.props.dateAsMs).getMonth();
    }

    if (this.props.date) {
      return this.props.date.getMonth();
    }

    if (this.monthRef.current) {
      return this.monthRef.current.value;
    }
  }

  public getYear(): number | string | undefined {
    if (this.props.dateAsMs) {
      return new Date(this.props.dateAsMs).getFullYear();
    }

    if (this.props.date) {
      return this.props.date.getFullYear();
    }

    if (this.yearRef.current) {
      return this.yearRef.current.value;
    }
  }

  render() {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const monthMap = new Map();
    monthMap.set(0, "Ocak");
    monthMap.set(1, "Şubat");
    monthMap.set(2, "Mart");
    monthMap.set(3, "Nisan");
    monthMap.set(4, "Mayıs");
    monthMap.set(5, "Haziran");
    monthMap.set(6, "Temmuz");
    monthMap.set(7, "Ağustos");
    monthMap.set(8, "Eylül");
    monthMap.set(9, "Ekim");
    monthMap.set(10, "Kasım");
    monthMap.set(11, "Aralık");

    const years = Array.from(
      { length: 100 },
      (_, i) => new Date().getFullYear() - 99 + i
    ).reverse();

    return (
      <Form.Group as={Col}>
        <Form.Label>{this.props.required ? AysUtils.getLabelWithRequiredIndicator("Doğum Tarihi") : "Doğum Tarihi"}</Form.Label>
        <Row>
          <Col>
            <Form.Select
              className="select-wrapper"
              ref={this.dayRef}
              defaultValue={this.getDay()}
            >
              <option hidden value={"blank"}>{"Gün"}</option>
              {days.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={4} className="gx-1">
            <Form.Select
              ref={this.monthRef}
              defaultValue={this.getMonth()}
            >
              <option hidden value={"blank"}>{"Ay"}</option>
              {Array.from(monthMap.entries()).map(([key, month], index) => (
                <option key={index} value={key}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Select
              ref={this.yearRef}
              defaultValue={this.getYear()}
              className="date-select"
            >
              <option hidden value={"blank"}>{"Yıl"}</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    );
  }
}

export default DateSelector;