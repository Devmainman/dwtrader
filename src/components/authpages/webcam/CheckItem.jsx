"use client";
import React from "react";
import PropTypes from "prop-types";
import CheckIcon from "./CheckIcon";

function CheckItem({ text }) {
  return (
    <div className="flex gap-1.5 items-center mb-3.5">
      <CheckIcon />
      <p className="text-xs leading-3 text-neutral-400">{text}</p>
    </div>
  );
}

CheckItem.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CheckItem;
