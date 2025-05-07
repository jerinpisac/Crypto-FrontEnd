import React from "react";

function AboutPage(props, ref) {
  return (
    <div ref={ref} className="aboutpage">
      <div className="head">Welcome To RVesting</div>
      <div className="subhead">
        <label>
          RVesting is your one-stop platform for all things stock-crypto trading
          and investment. Whether you're an experienced trader or a beginner
          looking to explore the stock-crypto market, we've got you covered.
        </label>
      </div>
      <div className="weoffer">
        <div className="heading">What We Offer?</div>
        <div className="subhead">
          <ul>
            <li>
              <b>Seamless Stock-Crypto Trading:</b> Effortlessly buy and sell
              stocks or cryptocurrencies with our user-friendly interface.
            </li>
            <li>
              <b>Smart Investment Recommendations:</b> Powered by advanced
              genetic algorithms, our platform analyzes the data you provide
              during registration to suggest the best crypto tailored to your
              financial goals and risk preferences.
            </li>
            <li>
              <b>Secure and Personalized Experience:</b> Your financial data and
              preferences are protected with industry-standard security
              measures, ensuring a safe and tailored experience.
            </li>
          </ul>
        </div>
      </div>
      <div className="wcrvesting">
        <div className="heading">Why Choose RVesting?</div>
        <div className="subhead">
          <ul>
            <li>
              <b>Innovative Technology:</b> Using cutting-edge algorithms, we
              provide insights that help you make informed investment decisions.
            </li>
            <li>
              <b>Accessibility for All:</b> Whether you're a novice or an
              expert, our platform is designed to cater to everyone.
            </li>
            <li>
              <b>Community and Support:</b> Join a growing community of
              investors and traders, with dedicated support to assist you
              whenever needed.
            </li>
          </ul>
        </div>
      </div>
      <div className="registernow">
        <label>
          Start your journey towards smarter investments today. Register now and
          take control of your financial future with RVesting!
        </label>
      </div>
    </div>
  );
}

export default React.forwardRef(AboutPage);
