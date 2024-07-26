import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

export const UserBadgeItem = ({ user, handleFunction }) => {
  // Function to handle click events on the CloseIcon
  const handleCloseClick = (e) => {
    e.stopPropagation(); // Prevents the click event from propagating to the parent element
    handleFunction();
  };

  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      textColor={"white"}
      cursor={"pointer"}
      onClick={() => handleFunction(user)} // Ensure the user is passed correctly
    >
      {user.name}
      <CloseIcon pl={1} onClick={handleCloseClick} />
    </Box>
  );
};
