import { useState, useEffect } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { validateFields } from "../../utils/validation";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Flex,
  Heading,
  Text,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [errors, setErrors] = useState({}); // will store error messages
  const [touched, setTouched] = useState({}); //will track for client interaction

  const {
    handleRegister,
    authState: { isSubmitting, errorMsg },
  } = useAuthContext();

  const handleShowPwd = () => setShow(!show);
  const handleShowConfirmPwd = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    // Mark all fields as touched after the component mounts, error messages are displayed only after the user interacts with the respective fields.
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({
      ...errors,
      [name]: validateFields(name, touched, formData, "register"),
    }); //update with errors found
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      //all fields were touched
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields on form submission
    const newErrors = {};
    Object.keys(formData).forEach((fieldName) => {
      newErrors[fieldName] = validateFields(
        fieldName,
        touched,
        formData,
        "register"
      );
    });
    setErrors(newErrors);

    // Check if there are any errors before submitting
    const isFormValid = Object.values(newErrors).every(
      (error) => error === ""
    ); //  all empty strings(no errors)

    if (isFormValid) {
      await handleRegister(formData);
    }
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading size={"lg"}>Sign up for an account</Heading>

          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <FormControl id="name" isInvalid={errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <FormErrorMessage>
                  {errors.name && errors.name}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="email" isInvalid={errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                />
                <FormErrorMessage>
                  {errors.email && errors.email}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={show ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleShowPwd}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="confirmPassword"
                isInvalid={errors.confirmPassword}
              >
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleShowConfirmPwd}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
              <Stack spacing={6}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Text color={"blue.500"}>Forgot password?</Text>
                </Stack>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="sm"
                  fontSize="md"
                  isLoading={isLoading || isSubmitting}
                  loadingText="Registering..."
                >
                  Register
                </Button>

                <Link to="/login">
                  {" "}
                  <Text
                    align={"center"}
                    color={"blue.500"}
                    fontSize={"sm"}
                    decoration="aliceblue"
                  >
                    Have an account?
                  </Text>
                </Link>
              </Stack>
            </Stack>
          </form>
          {errorMsg && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMsg && errorMsg}
              </AlertDescription>
            </Alert>
          )}
        </Stack>
      </Flex>

      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          }
        />
      </Flex>
    </Stack>
  );
};

export default Register;
