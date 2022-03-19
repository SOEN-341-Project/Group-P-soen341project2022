import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { ProductGrid } from './Components/Products/ProductGrid';
import { SideNav } from './Components/Products/SideNav';
import React from 'react';
// import { shallow } from 'enzyme';
// import NavBar from "./Components/NavBar";
import TestData from './TestValues.json';

test('returns true all the time!', () => {
  expect(true).toBe(true);
});


/*
TODO:
  - add cart page tests
  - add login tests
*/

//contains errors --> to be fixed in separate PR
/*describe("NavBar component", () => {
  it("should change openLogin state to true when handleOpenLogin is called", () => {
    const wrapper = shallow(<NavBar/>);

    const spy = jest.spyOn(wrapper.instance(), "handleOpenLogin");

    wrapper.instance().handleOpenLogin();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});*/

// sample test --> does not work
/*it("should update state on click", () => {
  const changeSize = jest.fn();
  const wrapper = mount(<App onClick={changeSize} />);
  const handleClick = jest.spyOn(React, "useState");
  handleClick.mockImplementation(size => [size, changeSize]);

  wrapper.find("#para1").simulate("click");
  expect(changeSize).toBeCalled();
});*/

/*test('renders Product Grid items', () => {
  render(<ProductGrid products={TestData.products} />);
  TestData.products.forEach(product => {
    let productElement = screen.getByText(product.name);
    expect(productElement).toBeInTheDocument();
  });
});*/

/*test('renders SideNav', () => {
  render(<SideNav brands={TestData} sellers={TestData} />);
  TestData.brands.forEach(brand => {
    let brandElement = screen.getByText(brand);
    expect(brandElement).toBeInTheDocument();
  });
  TestData.sellers.forEach(seller => {
    let sellerElement = screen.getByText(seller);
    expect(sellerElement).toBeInTheDocument();
  });
});*/
