package com.example.backend.social.follow.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.global.rs.RsData;
import com.example.backend.identity.security.user.SecurityUser;
import com.example.backend.social.follow.dto.CreateFollowRequest;
import com.example.backend.social.follow.dto.CreateFollowResponse;
import com.example.backend.social.follow.dto.DeleteFollowRequest;
import com.example.backend.social.follow.dto.DeleteFollowResponse;
import com.example.backend.social.follow.dto.MutualFollowResponse;
import com.example.backend.social.follow.service.FollowService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * FollowController
 * "/likes" 로 들어오는 요청 처리 컨트롤러
 *
 * @author Metronon
 * @since 2025-01-30
 */
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api-v1/follow", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "FollowController", description = "팔로우 컨트롤러")
@SecurityRequirement(name = "bearerAuth")
public class FollowController {
	private final FollowService followService;

	/**
	 * 다른 멤버를 대상으로 팔로우 요청
	 * @param receiverId(상대방), securityUser(본인)
	 * @return CreateFollowResponse (DTO)
	 */
	@PostMapping("/{receiverId}")
	@ResponseStatus(HttpStatus.OK)
	public RsData<CreateFollowResponse> followMember(
		@PathVariable Long receiverId, // TODO: 추후 인증 정보를 가져오며 검증 로직 추가 예정
		@Valid @RequestBody CreateFollowRequest createRequest
	) {
		CreateFollowResponse createResponse = followService.createFollow(
			createRequest.senderId(), createRequest.receiverId()
		);
		return RsData.success(createResponse, "팔로우 등록 요청에 성공했습니다.");
	}

	/**
	 * 다른 멤버를 대상으로 팔로우 관계 취소 요청
	 * @param receiverId(상대방), DeleteFollowRequest(FollowId), securityUser(본인)
	 * @return DeleteFollowResponse (DTO)
	 */
	@DeleteMapping("/{receiverId}")
	@ResponseStatus(HttpStatus.OK)
	public RsData<DeleteFollowResponse> unfollowMember(
		@PathVariable Long receiverId, // TODO: 추후 인증 정보를 가져오며 검증 로직 추가 예정
		@Valid @RequestBody DeleteFollowRequest deleteRequest
	) {
		DeleteFollowResponse deleteResponse = followService.deleteFollow(
			deleteRequest.id(), deleteRequest.senderId(), deleteRequest.receiverId()
		);
		return RsData.success(deleteResponse, "팔로우 취소 요청에 성공했습니다.");
	}

	/**
	 * 상대방과 맞팔로우 상태인지 확인하는 메서드
	 *
	 * @param memberId(상대방), securityUser(본인)
	 * @return MutualFollowResponse (DTO)
	 */
	@GetMapping("/mutual/{memberId}")
	@ResponseStatus(HttpStatus.OK)
	public RsData<MutualFollowResponse> isMutualFollow(
		@PathVariable Long memberId,
		@AuthenticationPrincipal SecurityUser securityUser
	) {
		Long currentMemberId = securityUser.getId();

		boolean isMutualFollow = followService.findMutualFollow(currentMemberId, memberId);

		MutualFollowResponse getResponse = new MutualFollowResponse(isMutualFollow);

		return RsData.success(getResponse, "맞팔로우 여부 조회에 성공했습니다.");
	}
}
