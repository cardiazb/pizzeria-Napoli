import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  Card,
  Button,
  ListGroup,
  Form,
  Col,
  Row,
  Modal,
  Image,
} from "react-bootstrap";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaWallet } from "react-icons/fa";
import { SiWebmoney } from "react-icons/si";
import { MdAccountBalance } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import checkoutImage from "../assets/fotos/foto-checkout.jpg";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";



const ShoppingCartPage = () => {

  const crearOrden = async () => {
    const body_data = {
      total: totalAmount,
      tipo_de_pago: selectedPaymentMethod,
      delivery: false,
      productos: cartItems.map(item => ({
        producto_id: item.id,
        cantidad: item.quantity
      }))
    };
    console.log(body_data);
    const response = await fetch("https://hito-3-desafio-final-g65.onrender.com/api/pedidos",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
        
        },
        body: JSON.stringify(body_data)
        });
      return response;
      };
  const { cartItems, setCartItems } = useContext(AppContext);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Tarjeta de Crédito o Débito");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentConfirmation = async() => {
    setShowConfirmationModal(true);
    await crearOrden().then((success) => {
      console.log(success);
      if (success.status === 201) {
        setCartItems([]);
        setShowConfirmationModal(false);
        toast.success("Orden creada exitosamente", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          onClose: () => navigate("/"),
        });
      }
      else {
        showConfirmationModal(false);
        toast.error(`Error: ${success}`, {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }).catch((error) => {
      showConfirmationModal(false);
      toast.error(`Error: ${error}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

  };

  return (
    <div className="container mt-5">
      <h2>Carro de Compras</h2>
      <ToastContainer />
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Detalles de Productos</Card.Title>
              {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <strong>{item.nombre}</strong>
                          <p>
                            Precio unitario: $
                            {item.precio.toLocaleString("es-CL")}
                          </p>
                          <p>Cantidad: {item.quantity}</p>
                        </Col>
                        <Col md={4} className="text-end">
                          <p>
                            Total: $
                            {(item.precio * item.quantity).toLocaleString(
                              "es-CL"
                            )}
                          </p>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mt-3">
                  <Form.Label>Medio de pago</Form.Label>
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    {selectedPaymentMethod || "Selecciona un método de pago"}
                  </Button>
                </Form.Group>
              </Form>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total Productos:</strong>
                <span>${totalAmount.toLocaleString("es-CL")}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Despacho:</strong>
                <span>Por calcular</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Total a Pagar:</strong>
                <span>${totalAmount.toLocaleString("es-CL")}</span>
              </div>
              {cartItems.length > 0 ? (<Button
                className="w-100 mt-3"
                variant="danger"
                onClick={handlePaymentConfirmation}
              >
                Pagar
              </Button>) : (<Button
                className="w-100 mt-3 disabled"
                variant="danger"
                onClick={handlePaymentConfirmation}
              >
                Carrito Vacío
              </Button>)}
              
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de medios de pago */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Medios de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label={
                <>
                  <FaCcVisa /> <FaCcMastercard /> <FaCcAmex /> Tarjeta de
                  Crédito o Débito
                </>
              }
              name="paymentMethod"
              onChange={() =>
                handlePaymentMethodChange("Tarjeta de Crédito o Débito")
              }
              checked={selectedPaymentMethod === "Tarjeta de Crédito o Débito"}
            />
            <Form.Check
              type="radio"
              label={
                <>
                  <SiWebmoney /> Webpay / Onepay
                </>
              }
              name="paymentMethod"
              onChange={() => handlePaymentMethodChange("Webpay / Onepay")}
              checked={selectedPaymentMethod === "Webpay / Onepay"}
            />
            <Form.Check
              type="radio"
              label={
                <>
                  <MdAccountBalance /> Paga con tu Banco
                </>
              }
              name="paymentMethod"
              onChange={() => handlePaymentMethodChange("Paga con tu Banco")}
              checked={selectedPaymentMethod === "Paga con tu Banco"}
            />
            <Form.Check
              type="radio"
              label={
                <>
                  <FaWallet /> MACH
                </>
              }
              name="paymentMethod"
              onChange={() => handlePaymentMethodChange("MACH")}
              checked={selectedPaymentMethod === "MACH"}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowPaymentModal(false)}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de pago */}
      <Modal show={showConfirmationModal} centered>
        <Modal.Body className="text-center">
          <Image
            src={checkoutImage}
            fluid
            className="mb-3"
            style={{ maxWidth: "65%" }}
          />
          <h4 className="mt-4">¡Muchas gracias por tu compra 🍕! </h4>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShoppingCartPage;
