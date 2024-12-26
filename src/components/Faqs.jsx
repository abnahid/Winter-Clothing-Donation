const Faqs = () => {
  return (
    <section className="my-16">
      <div className="container mx-auto p-5">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5">
          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              How does your service work?
            </div>
            <div className="collapse-content">
              <p>
                Our platform connects users with trusted service providers.
                Simply browse the services, choose what you need, and place a
                request. We’ll handle the rest, ensuring a seamless experience.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              Is there a fee to use your platform?
            </div>
            <div className="collapse-content">
              <p>
                Our platform is free to use for browsing and connecting with
                providers. Some premium services may have additional fees, which
                will be clearly mentioned during checkout.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              What happens if I need support?
            </div>
            <div className="collapse-content">
              <p>
                Our customer support team is available 24/7. Simply reach out
                through our chat feature or email us, and we’ll help resolve any
                issues promptly.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              Can I cancel my request after booking?
            </div>
            <div className="collapse-content">
              <p>
                Yes, you can cancel your request before it’s confirmed with no
                charges. After confirmation, cancellation policies may apply
                depending on the service provider.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-white">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              What services do you offer?
            </div>
            <div className="collapse-content">
              <p>
                We offer a wide range of services, including home repairs,
                cleaning, moving, digital consultations, and more. Explore our
                categories to find what fits your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
